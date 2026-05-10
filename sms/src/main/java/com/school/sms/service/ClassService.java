package com.school.sms.service;

import com.school.sms.model.ClassRoom;
import com.school.sms.repository.ClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@org.springframework.stereotype.Service
@lombok.RequiredArgsConstructor
public class ClassService {
    private final com.school.sms.repository.ClassRepository classRepository;
}
