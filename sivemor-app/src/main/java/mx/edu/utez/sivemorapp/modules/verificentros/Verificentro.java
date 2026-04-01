package mx.edu.utez.sivemorapp.modules.verificentros;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.regiones.Region;

import java.util.List;

@Entity
@Table(name = "verificentros")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Verificentro extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_verificentro")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_region", nullable = false)
    private Region region;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "clave_verificentro", nullable = false)
    private String clave_verificentro;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "responsable", nullable = false)
    private String responsable;

    @Column(name = "correo", nullable = false)
    private String correo;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "telefono_alternativo", nullable = false)
    private String telefono_alternativo;

    @Column(name = "horario_general", nullable = false)
    private String horario_general;

    @JsonIgnore
    @OneToMany(mappedBy = "verificentro", fetch = FetchType.LAZY)
    private List<Notas> notas;

}
