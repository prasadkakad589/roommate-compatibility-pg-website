import User from '../models/User.js';
import Pg from '../models/Pg.js';
import {calculateDistance} from '../services/mapsService.js';
import {clusterUser} from '../services/mlService.js';
import Recommandation from '../models/Recommandation.js';

// Haversine formula — straight-line distance in km, no API needed
const haversineKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findMatches = async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attempt to cluster (non-critical — don't fail if ML service is down)
        try { await clusterUser(user.vector); } catch (_) {}

        // Get ALL other users
        const users = await User.find({ _id: { $ne: user._id } });

        // Get IDs of users who have at least one PG listed
        const pgsWithOwners = await Pg.find({}, 'owner');
        const pgOwnerIds = new Set(pgsWithOwners.map(pg => pg.owner.toString()));

        const result = [];

        for (const candidate of users) {
            // ── Distance check ─────────────────────────────────────────────
            const uLat = Number(user.profile?.latitude);
            const uLng = Number(user.profile?.longitude);
            const cLat = Number(candidate.profile?.latitude);
            const cLng = Number(candidate.profile?.longitude);

            let distance = 0;

            const uHasCoords = uLat && uLng && !isNaN(uLat) && !isNaN(uLng);
            const cHasCoords = cLat && cLng && !isNaN(cLat) && !isNaN(cLng);
            const hasCoords = uHasCoords && cHasCoords;

            if (hasCoords) {
                // Try Google Maps first; fall back to Haversine on any error
                try {
                    distance = await calculateDistance(uLat, uLng, cLat, cLng);
                    if (!distance || distance === 0) {
                        distance = haversineKm(uLat, uLng, cLat, cLng);
                    }
                } catch (_) {
                    distance = haversineKm(uLat, uLng, cLat, cLng);
                }
            }
            // If either user has no coordinates, distance stays 0 (always included)

            // Allow matches up to 30 km; always include users with no coords
            if (hasCoords && distance > 30) continue;

            // ── Compatibility score ─────────────────────────────────────────
            let score = 0;
            const reason = [];

            if (user.profile?.sleepTime !== undefined &&
                user.profile.sleepTime === candidate.profile?.sleepTime) {
                score += 25;
                reason.push("same sleep schedule");
            }
            if (user.profile?.food &&
                user.profile.food === candidate.profile?.food) {
                score += 20;
                reason.push("same food preference");
            }
            if (user.profile?.cleanliness !== undefined &&
                user.profile.cleanliness === candidate.profile?.cleanliness) {
                score += 20;
                reason.push("same cleanliness level");
            }
            if (user.profile?.personality &&
                user.profile.personality === candidate.profile?.personality) {
                score += 10;
                reason.push("same personality type");
            }
            if (user.profile?.smoking !== undefined &&
                user.profile.smoking === candidate.profile?.smoking) {
                score += 5;
                reason.push("same smoking preference");
            }
            if (user.profile?.drinking !== undefined &&
                user.profile.drinking === candidate.profile?.drinking) {
                score += 5;
                reason.push("same drinking preference");
            }

            // Base score so every nearby user appears
            score += 15;

            // Bonus: flag if this user has PGs available to book
            const hasPg = pgOwnerIds.has(candidate._id.toString());
            if (hasPg) {
                reason.push("has PG listings");
            }

            // Save recommendation (best-effort, skip duplicates silently)
            try {
                await Recommandation.create({
                    user: user._id,
                    recommendeduser: candidate._id,
                    score,
                    reason: reason.length ? reason : ["potential roommate"],
                });
            } catch (_) {}

            result.push({
                name: candidate.name,
                userId: candidate._id,
                distance: hasCoords ? Math.round(distance * 10) / 10 : null,
                compability: score,
                hasPg,
                reason,
            });
        }

        // Sort by highest compatibility first
        result.sort((a, b) => b.compability - a.compability);

        res.json(result);
    } catch (err) {
        console.error("findMatches error:", err);
        res.status(500).json({ message: err.message });
    }
};