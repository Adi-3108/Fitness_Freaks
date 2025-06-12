package com.fitnessfreaks;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.fitnessfreaks.backend.entity.Equipment;
import com.fitnessfreaks.backend.repository.EquipmentRepository;

@SpringBootApplication
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	@Bean
    CommandLineRunner seedDatabase(EquipmentRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.saveAll(List.of(
                    new Equipment(null, "Hand Gripper", 125, "/HANDGRIPPER.webp"),
                    new Equipment(null, "Dumbbells (3kg × 2)", 369, "/dumbbel.webp"),
                    new Equipment(null, "Push Up Bar", 349, "/pushupbar.jpg"),
                    new Equipment(null, "Kettlebell", 1519, "/kettleball.jpg"),
                    new Equipment(null, "Tummy Trimmer", 999, "/tummytrimmer.jpg"),
                    new Equipment(null, "Treadmill", 24999, "/tredmill.jpg"),
                    new Equipment(null, "Bodyband Abs Roller", 529, "/Roller.webp"),
                    new Equipment(null, "Exercise Bike/Cycle", 26877, "/exercisebike.jpg"),
                    new Equipment(null, "Preacher Bench", 7699, "/bench.jpg"),
                    new Equipment(null, "Pull Up Bar", 649, "/pullupbar.webp"),
                    new Equipment(null, "20in1 exercise bench", 20775, "/exercisemany.jpg")
                    
                ));
            }
        };
    }
}
