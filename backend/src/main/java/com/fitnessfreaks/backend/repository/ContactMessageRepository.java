package com.fitnessfreaks.backend.repository;

import com.fitnessfreaks.backend.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByIsReadFalseOrderByCreatedAtDesc();
    List<ContactMessage> findByIsReadTrueOrderByCreatedAtDesc();
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    long countByIsReadFalse();
} 