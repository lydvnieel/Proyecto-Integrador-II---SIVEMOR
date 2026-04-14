    package mx.edu.utez.sivemorapp.modules.verificaciones;

    import lombok.RequiredArgsConstructor;
    import mx.edu.utez.sivemorapp.kernel.ApiResponse;
    import mx.edu.utez.sivemorapp.kernel.enums.Dictamen;
    import mx.edu.utez.sivemorapp.kernel.enums.Materia;
    import mx.edu.utez.sivemorapp.modules.evaluaciones.EvaluacionRepository;
    import mx.edu.utez.sivemorapp.modules.notas.NotaRepository;
    import mx.edu.utez.sivemorapp.modules.notas.Notas;
    import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;
    import mx.edu.utez.sivemorapp.modules.vehiculos.VehiculoRepository;
    import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.VerificacionRequestDTO;
    import mx.edu.utez.sivemorapp.modules.verificaciones.dtos.utils.VerificacionMapper;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.math.BigDecimal;
    import java.sql.SQLException;
    import java.time.LocalDate;
    import java.util.List;
    import java.util.UUID;

    @Service
    @RequiredArgsConstructor
    public class VerificacionService {

        private final VerificacionRepository verificacionRepository;
        private final VehiculoRepository vehiculoRepository;
        private final NotaRepository notaRepository;
        private final EvaluacionRepository evaluacionRepository;

        @Transactional(readOnly = true)
        public ResponseEntity<ApiResponse> filterVerificaciones(
                Long idVehiculo,
                Long idNota,
                String materiaStr,
                String dictamenStr,
                String fechaVerificacionStr
        ) {
            ApiResponse response;

            try {
                Materia materia = null;
                Dictamen dictamen = null;
                LocalDate fechaVerificacion = null;

                if (materiaStr != null && !materiaStr.isBlank()) {
                    try {
                        materia = Materia.valueOf(materiaStr.toUpperCase());
                    } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                .body(new ApiResponse("Materia inválida", true, HttpStatus.BAD_REQUEST));
                    }
                }

                if (dictamenStr != null && !dictamenStr.isBlank()) {
                    try {
                        dictamen = Dictamen.valueOf(dictamenStr.toUpperCase());
                    } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                .body(new ApiResponse("Dictamen inválido", true, HttpStatus.BAD_REQUEST));
                    }
                }

                if (fechaVerificacionStr != null && !fechaVerificacionStr.isBlank()) {
                    try {
                        fechaVerificacion = LocalDate.parse(fechaVerificacionStr);
                    } catch (Exception e) {
                        return ResponseEntity.badRequest()
                                .body(new ApiResponse("Fecha de verificación inválida. Usa formato yyyy-MM-dd", true, HttpStatus.BAD_REQUEST));
                    }
                }

                List<Verificacion> result;

                if (idVehiculo != null && idNota != null && materia != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndMateriaAndDictamenAndFechaVerificacion(
                            idVehiculo, idNota, materia, dictamen, fechaVerificacion
                    );
                } else if (idVehiculo != null && idNota != null && materia != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndMateriaAndDictamen(
                            idVehiculo, idNota, materia, dictamen
                    );
                } else if (idVehiculo != null && idNota != null && materia != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndMateriaAndFechaVerificacion(
                            idVehiculo, idNota, materia, fechaVerificacion
                    );
                } else if (idVehiculo != null && idNota != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndDictamenAndFechaVerificacion(
                            idVehiculo, idNota, dictamen, fechaVerificacion
                    );
                } else if (idVehiculo != null && materia != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndMateriaAndDictamenAndFechaVerificacion(
                            idVehiculo, materia, dictamen, fechaVerificacion
                    );
                } else if (idNota != null && materia != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndMateriaAndDictamenAndFechaVerificacion(
                            idNota, materia, dictamen, fechaVerificacion
                    );
                } else if (idVehiculo != null && idNota != null && materia != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndMateria(
                            idVehiculo, idNota, materia
                    );
                } else if (idVehiculo != null && idNota != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndDictamen(
                            idVehiculo, idNota, dictamen
                    );
                } else if (idVehiculo != null && idNota != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_IdAndFechaVerificacion(
                            idVehiculo, idNota, fechaVerificacion
                    );
                } else if (idVehiculo != null && materia != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndMateriaAndDictamen(
                            idVehiculo, materia, dictamen
                    );
                } else if (idVehiculo != null && materia != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndMateriaAndFechaVerificacion(
                            idVehiculo, materia, fechaVerificacion
                    );
                } else if (idVehiculo != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndDictamenAndFechaVerificacion(
                            idVehiculo, dictamen, fechaVerificacion
                    );
                } else if (idNota != null && materia != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndMateriaAndDictamen(
                            idNota, materia, dictamen
                    );
                } else if (idNota != null && materia != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndMateriaAndFechaVerificacion(
                            idNota, materia, fechaVerificacion
                    );
                } else if (idNota != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndDictamenAndFechaVerificacion(
                            idNota, dictamen, fechaVerificacion
                    );
                } else if (materia != null && dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndMateriaAndDictamenAndFechaVerificacion(
                            materia, dictamen, fechaVerificacion
                    );
                } else if (idVehiculo != null && idNota != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndNota_Id(idVehiculo, idNota);
                } else if (idVehiculo != null && materia != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndMateria(idVehiculo, materia);
                } else if (idVehiculo != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndDictamen(idVehiculo, dictamen);
                } else if (idVehiculo != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_IdAndFechaVerificacion(idVehiculo, fechaVerificacion);
                } else if (idNota != null && materia != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndMateria(idNota, materia);
                } else if (idNota != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndDictamen(idNota, dictamen);
                } else if (idNota != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_IdAndFechaVerificacion(idNota, fechaVerificacion);
                } else if (materia != null && dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndMateriaAndDictamen(materia, dictamen);
                } else if (materia != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndMateriaAndFechaVerificacion(materia, fechaVerificacion);
                } else if (dictamen != null && fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndDictamenAndFechaVerificacion(dictamen, fechaVerificacion);
                } else if (idVehiculo != null) {
                    result = verificacionRepository.findByActivoTrueAndVehiculo_Id(idVehiculo);
                } else if (idNota != null) {
                    result = verificacionRepository.findByActivoTrueAndNota_Id(idNota);
                } else if (materia != null) {
                    result = verificacionRepository.findByActivoTrueAndMateria(materia);
                } else if (dictamen != null) {
                    result = verificacionRepository.findByActivoTrueAndDictamen(dictamen);
                } else if (fechaVerificacion != null) {
                    result = verificacionRepository.findByActivoTrueAndFechaVerificacion(fechaVerificacion);
                } else {
                    result = verificacionRepository.findByActivoTrue();
                }

                response = new ApiResponse(
                        "Operación exitosa",
                        VerificacionMapper.toDtoList(result),
                        HttpStatus.OK
                );

            } catch (Exception e) {
                e.printStackTrace();
                response = new ApiResponse("Error al consultar verificaciones", true, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return new ResponseEntity<>(response, response.getStatus());
        }

        @Transactional(readOnly = true)
        public ResponseEntity<ApiResponse> findById(Long id) {
            Verificacion found = verificacionRepository.findByIdAndActivoTrue(id).orElse(null);

            if (found == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("La verificación no existe", true, HttpStatus.NOT_FOUND));
            }

            return ResponseEntity.ok(
                    new ApiResponse("Operación exitosa", VerificacionMapper.toDto(found), HttpStatus.OK)
            );
        }

        @Transactional(rollbackFor = {SQLException.class, Exception.class})
        public ResponseEntity<ApiResponse> save(VerificacionRequestDTO dto) {
            try {
                if (dto.getIdNota() == null) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("La nota es obligatoria", true, HttpStatus.BAD_REQUEST));
                }

                if (dto.getIdVehiculo() == null) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("El vehículo es obligatorio", true, HttpStatus.BAD_REQUEST));
                }

                if (dto.getMateria() == null || dto.getMateria().isBlank()) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("La materia es obligatoria", true, HttpStatus.BAD_REQUEST));
                }

                if (dto.getPrecio() == null || dto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("El precio debe ser mayor a 0", true, HttpStatus.BAD_REQUEST));
                }

                Notas nota = notaRepository.findById(dto.getIdNota()).orElse(null);
                Vehiculo vehiculo = vehiculoRepository.findById(dto.getIdVehiculo()).orElse(null);

                if (nota == null || !Boolean.TRUE.equals(nota.getActivo())) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse("Nota no encontrada", true, HttpStatus.NOT_FOUND));
                }

                if (vehiculo == null || !Boolean.TRUE.equals(vehiculo.getActivo())) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse("Vehículo no encontrado", true, HttpStatus.NOT_FOUND));
                }

                Materia materia;
                try {
                    materia = Materia.valueOf(dto.getMateria().toUpperCase());
                } catch (Exception e) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("Materia inválida", true, HttpStatus.BAD_REQUEST));
                }

                Verificacion v = Verificacion.builder()
                        .nota(nota)
                        .vehiculo(vehiculo)
                        .materia(materia)
                        .precio(dto.getPrecio())
                        .multa(dto.getMulta() != null ? dto.getMulta() : BigDecimal.ZERO)
                        .folioVerificacion("VER-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                        .fechaVerificacion(LocalDate.now())
                        .build();

                v.setActivo(true);
                v.setPagado(dto.getPagado() != null ? dto.getPagado() : false);

                v.setDictamen(Dictamen.PENDIENTE);

                Verificacion saved = verificacionRepository.save(v);

                return ResponseEntity.status(HttpStatus.CREATED)
                        .body(new ApiResponse("Creado", VerificacionMapper.toDto(saved), HttpStatus.CREATED));

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError()
                        .body(new ApiResponse("Error al crear", true, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }

        @Transactional(rollbackFor = {SQLException.class, Exception.class})
        public ResponseEntity<ApiResponse> update(VerificacionRequestDTO dto) {
            try {
                if (dto.getId() == null) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("El id es obligatorio", true, HttpStatus.BAD_REQUEST));
                }

                Verificacion found = verificacionRepository.findById(dto.getId()).orElse(null);

                if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse("La verificación no existe", true, HttpStatus.NOT_FOUND));
                }

                if (dto.getMateria() == null || dto.getMateria().isBlank()) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("La materia es obligatoria", true, HttpStatus.BAD_REQUEST));
                }

                if (dto.getPrecio() == null || dto.getPrecio().compareTo(BigDecimal.ZERO) <= 0) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("El precio debe ser mayor a 0", true, HttpStatus.BAD_REQUEST));
                }

                Materia materia;
                try {
                    materia = Materia.valueOf(dto.getMateria().toUpperCase());
                } catch (Exception e) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse("Materia inválida", true, HttpStatus.BAD_REQUEST));
                }

                if (dto.getPagado() != null) {
                    found.setPagado(dto.getPagado());
                }

                found.setMateria(materia);
                found.setPrecio(dto.getPrecio());
                found.setMulta(dto.getMulta());

                Verificacion updated = verificacionRepository.save(found);

                return ResponseEntity.ok(
                        new ApiResponse("Actualización exitosa", VerificacionMapper.toDto(updated), HttpStatus.OK)
                );

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError()
                        .body(new ApiResponse("Error al actualizar", true, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }

        @Transactional(rollbackFor = {SQLException.class, Exception.class})
        public ResponseEntity<ApiResponse> delete(Long id) {
            try {
                Verificacion found = verificacionRepository.findById(id).orElse(null);

                if (found == null || !Boolean.TRUE.equals(found.getActivo())) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse("La verificación no existe", true, HttpStatus.NOT_FOUND));
                }

                boolean tieneEvaluacion = evaluacionRepository.existsByVerificacion_IdAndActivoTrue(id);
                if (tieneEvaluacion) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse(
                                    "No se puede eliminar la verificación porque tiene evaluación asociada",
                                    true,
                                    HttpStatus.BAD_REQUEST
                            ));
                }

                long totalActivasEnNota = verificacionRepository.countByNota_IdAndActivoTrue(found.getNota().getId());
                if (totalActivasEnNota <= 1) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse(
                                    "No se puede eliminar la verificación porque la nota debe tener al menos una verificación",
                                    true,
                                    HttpStatus.BAD_REQUEST
                            ));
                }

                found.setActivo(false);
                verificacionRepository.save(found);

                return ResponseEntity.ok(new ApiResponse("Eliminado", HttpStatus.OK));

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError()
                        .body(new ApiResponse("Error al eliminar", true, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }

        @Transactional
        public ResponseEntity<ApiResponse> marcarPagado(List<Long> ids) {
            try {
                List<Verificacion> lista = verificacionRepository.findAllById(ids);

                for (Verificacion v : lista) {
                    v.setPagado(true);
                }

                verificacionRepository.saveAll(lista);

                return ResponseEntity.ok(
                        new ApiResponse("Verificaciones marcadas como pagadas", HttpStatus.OK)
                );

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.internalServerError()
                        .body(new ApiResponse("Error al marcar como pagado", true, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }
    }