package com.school.sms.service.admin;

import com.school.sms.model.admin.AdmissionLead;
import com.school.sms.repository.admin.AdmissionLeadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdmissionCrmService {

    private final AdmissionLeadRepository leadRepository;

    /** Fetch all leads across all pipeline stages */
    public List<AdmissionLead> getAllLeads() {
        return leadRepository.findAll();
    }

    /** Fetch leads filtered by a specific pipeline stage */
    public List<AdmissionLead> getLeadsByStatus(AdmissionLead.LeadStatus status) {
        return leadRepository.findByStatus(status);
    }

    /** Move a lead to a new pipeline stage */
    @Transactional
    public AdmissionLead updateLeadStatus(Long leadId, AdmissionLead.LeadStatus newStatus) {
        log.info("Updating lead {} to status {}", leadId, newStatus);
        AdmissionLead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + leadId));
        lead.setStatus(newStatus);
        return leadRepository.save(lead);
    }

    /** Create a new admission enquiry lead */
    @Transactional
    public AdmissionLead createLead(AdmissionLead lead) {
        log.info("Creating new admission lead for {}", lead.getStudentName());
        lead.setStatus(AdmissionLead.LeadStatus.NEW);
        return leadRepository.save(lead);
    }

    /** Update an existing lead's details */
    @Transactional
    public AdmissionLead updateLead(Long leadId, AdmissionLead updatedLead) {
        log.info("Updating lead details for id={}", leadId);
        AdmissionLead existing = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + leadId));
        // Selectively update fields to avoid overwriting relations
        existing.setStudentName(updatedLead.getStudentName());
        existing.setParentName(updatedLead.getParentName());
        existing.setPhone(updatedLead.getPhone());
        existing.setEmail(updatedLead.getEmail());
        existing.setSource(updatedLead.getSource());
        if (updatedLead.getStatus() != null) {
            existing.setStatus(updatedLead.getStatus());
        }
        return leadRepository.save(existing);
    }

    /** Delete a lead by id */
    @Transactional
    public void deleteLead(Long leadId) {
        log.info("Deleting lead id={}", leadId);
        if (!leadRepository.existsById(leadId)) {
            throw new IllegalArgumentException("Lead not found: " + leadId);
        }
        leadRepository.deleteById(leadId);
    }
}
