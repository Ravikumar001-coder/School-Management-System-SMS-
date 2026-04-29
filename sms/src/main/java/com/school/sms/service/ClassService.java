package com.school.sms.service;

import com.school.sms.model.ClassRoom;
import com.school.sms.repository.ClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;

    public List<ClassRoom> getAllClasses() {
        return classRepository.findAll();
    }
}
