package com.example.repository;

import com.example.model.Blend;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlendRepository extends JpaRepository<Blend, Long> {
    Optional<Blend> findByInviteCode(String inviteCode);
}
