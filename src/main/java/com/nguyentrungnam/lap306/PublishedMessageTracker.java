package com.nguyentrungnam.lap306;

import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service để track các message đã publish để tránh loop
 */
@Service
public class PublishedMessageTracker {
    
    // Track các message đã publish (topic + payload hash)
    private final Set<String> publishedMessages = ConcurrentHashMap.newKeySet();
    
    /**
     * Đánh dấu message đã được publish
     */
    public void markAsPublished(String topic, String payload) {
        String signature = topic + "|" + payload.hashCode();
        publishedMessages.add(signature);
        
        // Tự động xóa sau 5 giây để tránh memory leak
        // (Message sẽ được nhận lại ngay sau khi publish)
        new Thread(() -> {
            try {
                Thread.sleep(5000);
                publishedMessages.remove(signature);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
    
    /**
     * Kiểm tra message có phải từ backend không
     */
    public boolean isFromBackend(String topic, String payload) {
        String signature = topic + "|" + payload.hashCode();
        boolean isFromBackend = publishedMessages.contains(signature);
        if (isFromBackend) {
            // Xóa ngay sau khi check để message có thể được xử lý lại sau này
            publishedMessages.remove(signature);
        }
        return isFromBackend;
    }
    
    /**
     * Clear all tracked messages (nếu cần)
     */
    public void clear() {
        publishedMessages.clear();
    }
}


