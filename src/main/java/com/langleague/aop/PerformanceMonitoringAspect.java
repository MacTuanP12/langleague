package com.langleague.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Aspect for monitoring performance of service methods and database queries.
 */
@Aspect
@Component
public class PerformanceMonitoringAspect {

    private static final Logger LOG = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);
    private static final long SLOW_THRESHOLD_MS = 1000; // 1 second
    private static final long WARN_THRESHOLD_MS = 500; // 500ms

    /**
     * Monitor all transactional methods for slow queries
     */
    @Around("@annotation(org.springframework.transaction.annotation.Transactional)")
    public Object monitorTransactionalMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            if (duration > SLOW_THRESHOLD_MS) {
                LOG.warn("SLOW QUERY DETECTED: {} took {}ms", methodName, duration);
            } else if (duration > WARN_THRESHOLD_MS) {
                LOG.info("Slow method: {} took {}ms", methodName, duration);
            } else {
                LOG.debug("{} completed in {}ms", methodName, duration);
            }

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            LOG.error("{} failed after {}ms: {}", methodName, duration, e.getMessage());
            throw e;
        }
    }

    /**
     * Monitor repository methods for slow database queries
     */
    @Around("execution(* com.langleague.repository..*(..))")
    public Object monitorRepositoryMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        long startTime = System.currentTimeMillis();

        try {
            return joinPoint.proceed();
        } finally {
            long duration = System.currentTimeMillis() - startTime;

            if (duration > WARN_THRESHOLD_MS) {
                LOG.warn("Slow repository query: {} took {}ms", methodName, duration);
            }
        }
    }

    /**
     * Monitor service layer for performance
     */
    @Around("execution(* com.langleague.service..*Service.*(..))")
    public Object monitorServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        long startTime = System.currentTimeMillis();

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;

            if (duration > SLOW_THRESHOLD_MS) {
                LOG.warn("SLOW SERVICE METHOD: {}.{} took {}ms", className, methodName, duration);
            }

            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            LOG.error("{}.{} failed after {}ms: {}", className, methodName, duration, e.getMessage());
            throw e;
        }
    }
}
