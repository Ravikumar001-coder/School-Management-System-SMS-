package com.school.sms.config;

import com.school.sms.model.AcademicYear;
import com.school.sms.model.ClassRoom;
import com.school.sms.model.User;
import com.school.sms.repository.AcademicYearRepository;
import com.school.sms.repository.ClassRoomRepository;
import com.school.sms.repository.UserRepository;
import com.school.sms.service.UserRoleSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class LegacyDataRepairConfig {

    @Bean
    @Order(30)
    public CommandLineRunner repairLegacyData(
            AcademicYearRepository academicYearRepository,
            ClassRoomRepository classRoomRepository,
            UserRepository userRepository,
            UserRoleSyncService userRoleSyncService
    ) {
        return args -> {
            AcademicYear activeYear = academicYearRepository.findFirstByActiveTrueOrderByIdDesc().orElse(null);
            if (activeYear != null) {
                List<ClassRoom> classesWithoutYear = classRoomRepository.findByAcademicYearIsNull();
                if (!classesWithoutYear.isEmpty()) {
                    classesWithoutYear.forEach(classRoom -> classRoom.setAcademicYear(activeYear));
                    classRoomRepository.saveAll(classesWithoutYear);
                    log.info("Backfilled academic year {} for {} legacy class records.", activeYear.getLabel(), classesWithoutYear.size());
                }
            }

            List<User> users = userRepository.findAll();
            long repairedUsers = 0L;
            for (User user : users) {
                int before = user.getUserRoles() == null ? 0 : user.getUserRoles().size();
                if (before == 0 && !userRoleSyncService.syncRolesForUser(user).isEmpty()) {
                    repairedUsers++;
                }
            }

            if (repairedUsers > 0) {
                log.info("Assigned inferred roles to {} legacy users with missing user_roles records.", repairedUsers);
            }
        };
    }
}
