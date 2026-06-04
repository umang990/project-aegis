const API_URL = "https://project-aegis-zyr0.onrender.com/api/v1";

export const fetchDashboardData = async () => {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching dashboard:", error);
        return null;
    }
}

export const triggerAttackSwarm = async (target, threat) => {
    try {
        const response = await fetch(`${API_URL}/swarm/deploy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ target_system: target, threat_vector: threat })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `API error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error triggering attack:", error);
        return { error: true, message: error.message || "Failed to connect to the server" };
    }
}
