package mx.edu.utez.sivemorapp.modules.regiones;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.modules.cedis.Cedis;
import mx.edu.utez.sivemorapp.modules.verificentros.Verificentro;

import java.util.List;

@Entity
@Table(name = "regiones")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Region extends AuditFields {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_region")
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;


    @JsonIgnore
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private List<Cedis> cedis;

    @JsonIgnore
    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private List<Verificentro> verificentros;


}
