package alchem.ce.controller;

import alchem.ce.common.TriggerSpec;
import alchem.ce.service.CircleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/circle")
public class CircleController {

    private final CircleService circleService;

    public CircleController(CircleService circleService) {
        this.circleService = circleService;
    }

    @PostMapping("/trigger")
    public ResponseEntity<?> trigger(@RequestBody TriggerSpec spec) {
        var result = this.circleService.trigger(spec);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/quit")
    public ResponseEntity<?> quit() {
        this.circleService.quit();
        return ResponseEntity.ok(Map.of());
    }
}
