package alchem.ce.controller;

import alchem.ce.common.ProxySpec;
import alchem.ce.service.AppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class AppController {

    private final AppService appService;

    @PostMapping(path = "/proxy", produces = "application/json")
    public ResponseEntity<?> proxy(@RequestBody ProxySpec proxySpec) {
        var r = this.appService.proxy(proxySpec);
        return ResponseEntity.ok(r);
    }

    @PostMapping("/quit")
    public ResponseEntity<?> quit() {
        this.appService.quit();
        return ResponseEntity.ok(Map.of());
    }
}
