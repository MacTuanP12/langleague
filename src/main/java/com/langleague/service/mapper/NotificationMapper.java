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
    NotificationDTO toDto(Notification notification);

    @Mapping(target = "user", ignore = true)
    Notification toEntity(NotificationDTO notificationDTO);
}
