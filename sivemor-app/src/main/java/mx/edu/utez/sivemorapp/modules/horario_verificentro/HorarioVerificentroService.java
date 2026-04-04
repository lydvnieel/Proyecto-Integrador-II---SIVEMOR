package mx.edu.utez.sivemorapp.modules.horario_verificentro;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.sivemorapp.kernel.ApiResponse;
import mx.edu.utez.sivemorapp.kernel.enums.DiaSemana;

import mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos.HorarioRequestDTO;
import mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos.HorarioResponseDTO;
import mx.edu.utez.sivemorapp.modules.horario_verificentro.dtos.utils.HorarioMapper;
import mx.edu.utez.sivemorapp.modules.verificentros.Verificentro;
import mx.edu.utez.sivemorapp.modules.verificentros.VerificentroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.SQLException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioVerificentroService {

    private final HorarioVerificentroRepository horarioRepository;
    private final VerificentroRepository verificentroRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> getAll(Long idVerificentro, DiaSemana diaSemana) {
        List<HorarioVerificentro> result;

        if (idVerificentro != null && diaSemana != null) {
            result = horarioRepository.findByActivoTrueAndVerificentro_IdAndDiaSemana(idVerificentro, diaSemana);
        } else if (idVerificentro != null) {
            result = horarioRepository.findByActivoTrueAndVerificentro_Id(idVerificentro);
        } else if (diaSemana != null) {
            result = horarioRepository.findByActivoTrueAndDiaSemana(diaSemana);
        } else {
            result = horarioRepository.findByActivoTrue();
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", HorarioMapper.toDtoList(result), HttpStatus.OK)
        );
    }

    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse> findById(Long id) {
        HorarioVerificentro found = horarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El horario no existe", true, HttpStatus.NOT_FOUND));
        }

        return ResponseEntity.ok(
                new ApiResponse("Operación exitosa", HorarioMapper.toDto(found), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> save(HorarioRequestDTO dto) {

        if (dto.getIdVerificentro() == null || dto.getDiaSemana() == null
                || dto.getHoraInicio() == null || dto.getHoraFin() == null) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Existen campos obligatorios vacíos", true, HttpStatus.BAD_REQUEST));
        }

        Verificentro verificentro = verificentroRepository.findByIdAndActivoTrue(dto.getIdVerificentro()).orElse(null);
        if (verificentro == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El verificentro no existe", true, HttpStatus.NOT_FOUND));
        }

        if (!dto.getHoraInicio().isBefore(dto.getHoraFin())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La hora de inicio debe ser menor a la hora de fin", true, HttpStatus.BAD_REQUEST));
        }

        boolean yaExiste = horarioRepository.existsByVerificentro_IdAndDiaSemanaAndActivoTrue(
                dto.getIdVerificentro(), dto.getDiaSemana()
        );

        if (yaExiste) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Ya existe un horario registrado para ese verificentro y día", true, HttpStatus.BAD_REQUEST));
        }

        HorarioVerificentro horario = HorarioVerificentro.builder()
                .verificentro(verificentro)
                .diaSemana(dto.getDiaSemana())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .build();

        horario.setActivo(true);

        HorarioVerificentro saved = horarioRepository.save(horario);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("Horario de verificentro creado", HorarioMapper.toDto(saved), HttpStatus.CREATED));
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> update(Long id, HorarioRequestDTO dto) {
        HorarioVerificentro found = horarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El horario no existe", true, HttpStatus.NOT_FOUND));
        }

        Long idVerificentroFinal = found.getVerificentro().getId();
        DiaSemana diaSemanaFinal = found.getDiaSemana();

        if (dto.getIdVerificentro() != null) {
            Verificentro verificentro = verificentroRepository.findByIdAndActivoTrue(dto.getIdVerificentro()).orElse(null);
            if (verificentro == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse("El verificentro no existe", true, HttpStatus.NOT_FOUND));
            }
            found.setVerificentro(verificentro);
            idVerificentroFinal = verificentro.getId();
        }

        if (dto.getDiaSemana() != null) {
            found.setDiaSemana(dto.getDiaSemana());
            diaSemanaFinal = dto.getDiaSemana();
        }

        if (dto.getHoraInicio() != null) {
            found.setHoraInicio(dto.getHoraInicio());
        }

        if (dto.getHoraFin() != null) {
            found.setHoraFin(dto.getHoraFin());
        }

        if (found.getHoraInicio() == null || found.getHoraFin() == null || !found.getHoraInicio().isBefore(found.getHoraFin())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("La hora de inicio debe ser menor a la hora de fin", true, HttpStatus.BAD_REQUEST));
        }

        boolean duplicado = horarioRepository.existsByVerificentro_IdAndDiaSemanaAndIdNotAndActivoTrue(
                idVerificentroFinal, diaSemanaFinal, id
        );

        if (duplicado) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse("Ya existe un horario registrado para ese verificentro y día", true, HttpStatus.BAD_REQUEST));
        }

        HorarioVerificentro updated = horarioRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Horario de verificentro actualizado", HorarioMapper.toDto(updated), HttpStatus.OK)
        );
    }

    @Transactional(rollbackFor = {SQLException.class, Exception.class})
    public ResponseEntity<ApiResponse> delete(Long id) {
        HorarioVerificentro found = horarioRepository.findByIdAndActivoTrue(id).orElse(null);

        if (found == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse("El horario no existe", true, HttpStatus.NOT_FOUND));
        }

        found.setActivo(false);
        horarioRepository.save(found);

        return ResponseEntity.ok(
                new ApiResponse("Horario de verificentro eliminado", HttpStatus.OK)
        );
    }
}