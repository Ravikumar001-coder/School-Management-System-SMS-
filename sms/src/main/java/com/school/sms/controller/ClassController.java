package com.school.sms.controller;

import com.school.sms.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/classes-legacy")
@RequiredArgsConstructor
public class ClassController {
    private final ClassService classService;
}
