package com.nguyentrungnam.lap306;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.integration.mqtt.support.MqttHeaders;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.messaging.MessageChannel;
import org.springframework.stereotype.Service;

@Service
public class MqttPublisherService {
    @Autowired
    private MessageChannel mqttOutboundChannel;
    
    @Autowired
    private PublishedMessageTracker publishedMessageTracker;

    public void publish(String topic, String payload) {
        // Log để debug - xem khi nào backend publish lên MQTT
        System.out.println("Backend dang publish len MQTT - Topic: " + topic + ", Payload: " + payload);
        
        // Đánh dấu message đã được publish để tránh loop
        publishedMessageTracker.markAsPublished(topic, payload);
        
        // Sử dụng MqttHeaders.TOPIC để set topic cho message
        // Spring Integration sẽ tự động sử dụng header này để publish đến đúng topic
        mqttOutboundChannel.send(MessageBuilder.withPayload(payload)
                .setHeader(MqttHeaders.TOPIC, topic)
                .build());
    }
}
