package com.school.sms.repository;

import com.school.sms.model.Parent;
import com.school.sms.model.ParentStudentLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParentStudentLinkRepository extends JpaRepository<ParentStudentLink, Long> {
    List<ParentStudentLink> findByParentId(Long parentId);
    List<ParentStudentLink> findByStudentId(Long studentId);
    List<ParentStudentLink> findByParent(Parent parent);
    void deleteByParent(Parent parent);
}
