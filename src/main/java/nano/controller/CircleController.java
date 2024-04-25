package nano.controller;

import nano.common.TriggerPipelineDTO;
import nano.service.CircleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/circle")
public class CircleController {

    private final CircleService circleService;

    public CircleController(CircleService circleService) {
        this.circleService = circleService;
    }

    @PostMapping("/trigger_pipeline")
    public ResponseEntity<?> triggerPipeline(@RequestBody TriggerPipelineDTO triggerPipelineDTO) {
        var result = this.circleService.triggerPipeline(triggerPipelineDTO);
        return ResponseEntity.ok(result);
    }
}
