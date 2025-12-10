package com.langleague.service.mapper;

import com.langleague.domain.Notification;
import com.langleague.service.dto.NotificationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Notification} and its DTO {@link NotificationDTO}.
 */
@Mapper(componentModel = "spring")
public interface NotificationMapper extends EntityMapper<NotificationDTO, Notification> {
    @Mapping(target = "userLogin", source = "user.login")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "broadcast", ignore = true)
    @Mapping(target = "emailEnabled", ignore = true)
    @Mapping(target = "inAppEnabled", ignore = true)
    @Mapping(target = "smsEnabled", ignore = true)
    @Mapping(target = "dailyReminderEnabled", ignore = true)
    NotificationDTO toDto(Notification notification);

    @Override
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "version", ignore = true)
    Notification toEntity(NotificationDTO notificationDTO);

    @Override
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "version", ignore = true)
    void partialUpdate(@MappingTarget Notification entity, NotificationDTO dto);
}
