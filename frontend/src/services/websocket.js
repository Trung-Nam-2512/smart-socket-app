/**
 * WebSocket Service for real-time sensor data
 * Uses SockJS and STOMP for WebSocket communication
 */

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map(); // Map<topic, subscription>
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // 3 seconds
    }

    /**
     * Get WebSocket URL based on environment
     */
    getWebSocketUrl() {
        // SockJS sử dụng HTTP/HTTPS, không phải ws/wss
        const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
        const host = window.location.host;
        const url = `${protocol}//${host}/ws-sensor-sockjs`;
        // console.log('🔌 WebSocket URL:', url);
        return url;
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        if (this.isConnected && this.stompClient && this.stompClient.connected) {
            // console.log('WebSocket already connected');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                // Use SockJS and STOMP from window (loaded via CDN)
                if (!window.SockJS) {
                    // console.error('❌ SockJS not found. Available:', Object.keys(window).filter(k => k.toLowerCase().includes('sock')));
                    reject(new Error('SockJS not loaded. Please check CDN scripts in index.html'));
                    return;
                }

                // Check STOMP availability
                if (!window.Stomp) {
                    // console.error('❌ window.Stomp not found');
                    // console.error('Available window keys:', Object.keys(window).filter(k => k.toLowerCase().includes('stomp')));
                    // console.error('Full window keys:', Object.keys(window).slice(0, 20));
                    reject(new Error('STOMP not loaded. Please check CDN scripts in index.html'));
                    return;
                }

                // console.log('✓ STOMP library found:', window.Stomp);
                // console.log('STOMP structure:', Object.keys(window.Stomp));

                const wsUrl = this.getWebSocketUrl();
                // console.log('🔌 Creating SockJS connection to:', wsUrl);

                const socket = new window.SockJS(wsUrl);

                // Log SockJS events
                socket.onopen = () => {
                    // console.log('✓ SockJS connection opened');
                };
                socket.onclose = (event) => {
                    // console.log('⚠️ SockJS connection closed:', event);
                    this.isConnected = false;
                };
                socket.onerror = (error) => {
                    // console.error('❌ SockJS error:', error);
                };

                // STOMP client setup - sử dụng STOMP.js 2.3.3
                // STOMP.js 2.3.3: window.Stomp.Stomp.over(socket)
                if (!window.Stomp) {
                    // console.error('❌ window.Stomp not found. Available STOMP:', Object.keys(window).filter(k => k.toLowerCase().includes('stomp')));
                    reject(new Error('STOMP library not found. Please check CDN scripts in index.html'));
                    return;
                }

                // STOMP.js 2.3.3 structure: window.Stomp.Stomp.over(socket)
                if (window.Stomp.Stomp) {
                    this.stompClient = window.Stomp.Stomp.over(socket);
                    // console.log('✓ Using STOMP.js 2.3.3 (window.Stomp.Stomp)');
                } else if (window.Stomp.over) {
                    this.stompClient = window.Stomp.over(socket);
                    // console.log('✓ Using STOMP.js (window.Stomp.over)');
                } else {
                    // console.error('❌ STOMP structure not recognized:', window.Stomp);
                    reject(new Error('STOMP library structure not recognized'));
                    return;
                }

                // Disable debug logging
                this.stompClient.debug = function (str) {
                    // console.log('🔵 STOMP:', str);
                };

                // console.log('🔌 Attempting STOMP connection...');
                this.stompClient.connect(
                    {},
                    () => {
                        // console.log('✓✓✓ STOMP WebSocket connected successfully!');
                        this.isConnected = true;
                        this.reconnectAttempts = 0;
                        resolve();
                    },
                    (error) => {
                        // console.error('❌ STOMP connection error:', error);
                        this.isConnected = false;
                        this.handleReconnect();
                        reject(error);
                    }
                );
            } catch (error) {
                // console.error('❌ Error initializing WebSocket:', error);
                reject(error);
            }
        });
    }

    /**
     * Handle reconnection
     */
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            // console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
                this.connect().catch(() => {
                    // Reconnection failed, will retry
                });
            }, this.reconnectDelay);
        } else {
            // console.error('Max reconnection attempts reached');
        }
    }

    /**
     * Subscribe to a WebSocket topic
     * @param {string} topic - WebSocket topic (e.g., '/topic/home/s3/status')
     * @param {function} callback - Callback function to handle messages
     * @returns {function} Unsubscribe function
     */
    subscribe(topic, callback) {
        if (!this.isConnected || !this.stompClient || !this.stompClient.connected) {
            // console.warn('WebSocket not connected, attempting to connect...');
            this.connect().then(() => {
                this.subscribe(topic, callback);
            }).catch((error) => {
                // console.error('Failed to connect WebSocket:', error);
            });
            return () => { }; // Return empty unsubscribe function
        }

        // Check if already subscribed
        if (this.subscriptions.has(topic)) {
            // console.log(`Already subscribed to ${topic}`);
            return () => this.unsubscribe(topic);
        }

        try {
            // console.log(`🔌 Subscribing to topic: ${topic}`);
            const subscription = this.stompClient.subscribe(topic, (message) => {
                // console.log(`📨 Received message on ${topic}:`, message);
                try {
                    const data = JSON.parse(message.body);
                    // console.log(`✓ Parsed JSON data:`, data);
                    callback(data);
                } catch (e) {
                    // console.log(`⚠️ Message is not JSON, passing as string:`, message.body);
                    // If not JSON, pass as string
                    callback(message.body);
                }
            });

            this.subscriptions.set(topic, subscription);
            // console.log(`✓✓✓ Successfully subscribed to ${topic}`);

            return () => this.unsubscribe(topic);
        } catch (error) {
            // console.error(`❌ Error subscribing to ${topic}:`, error);
            return () => { }; // Return empty unsubscribe function
        }
    }

    /**
     * Unsubscribe from a topic
     */
    unsubscribe(topic) {
        const subscription = this.subscriptions.get(topic);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(topic);
            // console.log(`✓ Unsubscribed from ${topic}`);
        }
    }

    /**
     * Unsubscribe from all topics
     */
    unsubscribeAll() {
        this.subscriptions.forEach((subscription, topic) => {
            subscription.unsubscribe();
        });
        this.subscriptions.clear();
        // console.log('✓ Unsubscribed from all topics');
    }

    /**
     * Disconnect from WebSocket
     */
    disconnect() {
        this.unsubscribeAll();
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.disconnect();
            // console.log('✓ WebSocket disconnected');
        }
        this.isConnected = false;
    }
}

// Export singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;

