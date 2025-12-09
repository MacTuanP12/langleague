package com.langleague.config;

import java.util.List;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.test.context.ContextConfigurationAttributes;
import org.springframework.test.context.ContextCustomizer;
import org.springframework.test.context.ContextCustomizerFactory;
import org.springframework.test.context.MergedContextConfiguration;
import org.testcontainers.containers.MySQLContainer;

/**
 * Factory for creating ContextCustomizer that starts test containers.
 */
public class TestContainersSpringContextCustomizerFactory implements ContextCustomizerFactory {

    private static MySQLContainer<?> mySQLContainer;

    @Override
    public ContextCustomizer createContextCustomizer(Class<?> testClass, List<ContextConfigurationAttributes> configAttributes) {
        return new ContextCustomizer() {
            @Override
            public void customizeContext(ConfigurableApplicationContext context, MergedContextConfiguration mergedConfig) {
                if (AnnotatedElementUtils.hasAnnotation(testClass, EmbeddedSQL.class)) {
                    if (mySQLContainer == null) {
                        mySQLContainer = new MySQLContainer<>("mysql:8.0.33")
                            .withDatabaseName("langleague")
                            .withTmpFs(java.util.Map.of("/testtmpfs", "rw"))
                            .withReuse(true);
                        mySQLContainer.start();
                    }
                    TestPropertyValues.of(
                        "spring.datasource.url=" + mySQLContainer.getJdbcUrl(),
                        "spring.datasource.username=" + mySQLContainer.getUsername(),
                        "spring.datasource.password=" + mySQLContainer.getPassword()
                    ).applyTo(context.getEnvironment());
                }
            }
        };
    }
}
