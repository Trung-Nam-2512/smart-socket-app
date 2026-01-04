/**
 * API Service for IoT Backend
 * Handles all HTTP requests to the backend server
 */

// Support both absolute URLs (dev) and relative paths (production in same container)
const API_BASE_URL_ENV = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = API_BASE_URL_ENV && API_BASE_URL_ENV !== '/'
    ? API_BASE_URL_ENV
    : ''; // Empty string means relative path (same origin)

/**
 * Create axios instance with default config
 * Note: If axios is not installed, we'll use fetch API instead
 */
class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    /**
     * Generic request method using fetch API
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            // Handle non-JSON responses
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                return { data: text, status: response.status, ok: response.ok };
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return { data, status: response.status, ok: response.ok };
        } catch (error) {
            // console.error('API Request Error:', error);
            throw error;
        }
    }

    // ============ DEVICE APIs ============

    /**
     * Get all devices
     * GET /devices
     */
    async getAllDevices() {
        const response = await this.request('/devices', { method: 'GET' });
        return response.data;
    }

    /**
     * Get device by ID
     * GET /devices/{id}
     */
    async getDeviceById(id) {
        const response = await this.request(`/devices/${id}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get device by topic
     * GET /devices/by-topic?topic={topic}
     */
    async getDeviceByTopic(topic) {
        const response = await this.request(`/devices/by-topic?topic=${encodeURIComponent(topic)}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Create a new device
     * POST /devices
     */
    async createDevice(deviceData) {
        const response = await this.request('/devices', {
            method: 'POST',
            body: JSON.stringify(deviceData),
        });
        return response.data;
    }

    /**
     * Control device (send command via MQTT)
     * POST /devices/{id}/control
     * @param {number} deviceId - Device ID
     * @param {string|object} payload - Command payload (string or object that will be stringified)
     */
    async controlDevice(deviceId, payload) {
        // Convert object to string if needed
        const payloadString = typeof payload === 'object' ? JSON.stringify(payload) : payload;

        const url = `${this.baseURL}/devices/${deviceId}/control`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain', // Backend expects String, not JSON
                },
                body: payloadString,
            });

            // Backend returns plain text (String), not JSON
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            // console.log(`✓ Control command sent - Device: ${deviceId}, Command: ${payloadString}, Response: ${data}`);
            return data;
        } catch (error) {
            // console.error('Error controlling device:', error);
            throw error;
        }
    }

    /**
     * Control device by topic (convenience method)
     * First gets device by topic, then sends control command
     */
    async controlDeviceByTopic(topic, payload) {
        try {
            const deviceInfo = await this.getDeviceByTopic(topic);
            if (!deviceInfo.found) {
                throw new Error(`Device not found for topic: ${topic}`);
            }
            return await this.controlDevice(deviceInfo.deviceId, payload);
        } catch (error) {
            // console.error('Error controlling device by topic:', error);
            throw error;
        }
    }

    // ============ POWER PREDICTION APIs ============

    /**
     * Get daily power prediction
     * GET /api/power/predict/daily/{deviceId}
     */
    async getDailyPrediction(deviceId) {
        const response = await this.request(`/api/power/predict/daily/${deviceId}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get monthly power prediction
     * GET /api/power/predict/monthly/{deviceId}
     */
    async getMonthlyPrediction(deviceId) {
        const response = await this.request(`/api/power/predict/monthly/${deviceId}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get custom hours power prediction
     * GET /api/power/predict/{deviceId}?hours={hours}
     */
    async getCustomPrediction(deviceId, hours) {
        const response = await this.request(`/api/power/predict/${deviceId}?hours=${hours}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get consumption statistics
     * GET /api/power/stats/{deviceId}?hours={hours}
     * @param {number} deviceId - Device ID
     * @param {number} hours - Number of hours to retrieve stats for (default: 24)
     */
    async getConsumptionStats(deviceId, hours = 24) {
        const response = await this.request(`/api/power/stats/${deviceId}?hours=${hours}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get power consumption history
     * GET /api/power/history/{deviceId}?hours={hours}
     * @param {number} deviceId - Device ID
     * @param {number} hours - Number of hours to retrieve (default: 24)
     */
    async getPowerHistory(deviceId, hours = 24) {
        const response = await this.request(`/api/power/history/${deviceId}?hours=${hours}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get latest power data
     * GET /api/power/latest/{deviceId}
     */
    async getLatestPowerData(deviceId) {
        const response = await this.request(`/api/power/latest/${deviceId}`, { method: 'GET' });
        return response.data;
    }

    /**
     * Get list of device IDs that have power consumption data
     * GET /api/power/devices-with-data
     */
    async getDevicesWithData() {
        const response = await this.request(`/api/power/devices-with-data`, { method: 'GET' });
        return response.data;
    }

    // ============ TELEMETRY APIs ============

    /**
     * Get telemetry data for device
     * GET /api/telemetry/{deviceId}
     */
    async getTelemetry(deviceId) {
        const response = await this.request(`/api/telemetry/${deviceId}`, { method: 'GET' });
        return response.data;
    }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

