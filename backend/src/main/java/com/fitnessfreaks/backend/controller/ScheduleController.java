package com.fitnessfreaks.backend.controller;

import com.fitnessfreaks.backend.entity.Schedule;
import com.fitnessfreaks.backend.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")

public class ScheduleController {
    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/user/{userId}")
    public List<Schedule> getSchedules(@PathVariable Long userId) {
        return scheduleService.getSchedulesForUser(userId);
    }

    @PostMapping
    public Schedule addSchedule(@RequestBody Schedule schedule) {
        return scheduleService.addSchedule(schedule);
    }

    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
    }
}
