package com.school.sms.repository.admin;

import com.school.sms.model.admin.AdmissionLead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionLeadRepository extends JpaRepository<AdmissionLead, Long> {
    List<AdmissionLead> findByStatus(AdmissionLead.LeadStatus status);
}
