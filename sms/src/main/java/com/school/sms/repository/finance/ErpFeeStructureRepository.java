package com.school.sms.repository.finance;

import com.school.sms.model.finance.ErpFeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErpFeeStructureRepository extends JpaRepository<ErpFeeStructure, Long> {
    List<ErpFeeStructure> findByActiveTrueAndDueDay(Integer dueDay);
}
