package com.social.network.repository.user;

import com.social.network.entity.user.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepo extends JpaRepository<EmailVerification, Long> {
    EmailVerification findByToken(String token);
}
