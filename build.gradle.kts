plugins {
    id("java")
    id("org.springframework.boot") version "3.3.0"
    id("io.spring.dependency-management") version "1.1.5"
}

group = "nano"

java {
    sourceCompatibility = JavaVersion.VERSION_21
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // jetbrains annotations
    implementation("org.jetbrains:annotations:24.1.0")
    //
    implementation("org.springframework.boot:spring-boot-starter-web")
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks {
    processResources {
        from("${rootDir}/icons") {
            into("icons")
        }
    }

    test {
        useJUnitPlatform()
        jvmArgs = listOf("-Xshare:off")
    }
}
