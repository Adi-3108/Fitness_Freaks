package com.fitnessfreaks.backend.service;

import com.fitnessfreaks.backend.entity.Schedule;
import com.fitnessfreaks.backend.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ScheduleService {
    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<Schedule> getSchedulesForUser(Long userId) {
        return scheduleRepository.findByUserId(userId);
    }

    public Schedule addSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}
