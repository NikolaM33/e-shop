package com.shop.repository;

import com.shop.domain.entity.AbstractStatusEntity;
import com.shop.domain.entity.EntityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface AbstractStatusEntityRepository <T extends AbstractStatusEntity, ID> extends JpaRepository<T, ID> {

    Page<T> findByEntityStatus(EntityStatus entityStatus, Pageable pageable);

    List<T> findByEntityStatus(EntityStatus entityStatus);

    Optional<T> findByIdAndEntityStatus(ID id, EntityStatus entityStatus);
}
