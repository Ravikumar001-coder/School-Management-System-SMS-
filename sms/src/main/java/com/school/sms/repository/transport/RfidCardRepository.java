package com.school.sms.repository.transport;

import com.school.sms.model.transport.RfidCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RfidCardRepository extends JpaRepository<RfidCard, Long> {
    Optional<RfidCard> findByCardUid(String cardUid);
    Optional<RfidCard> findByStudentId(Long studentId);
    Optional<RfidCard> findByCardUidAndStatus(String cardUid, RfidCard.CardStatus status);
}
