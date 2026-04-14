package mx.edu.utez.sivemorapp.modules.clientes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.modules.cedis.Cedis;
import mx.edu.utez.sivemorapp.modules.costos.Costo;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "clientes")

public class Cliente extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;


    @Column(name = "razon_social", nullable = false, unique = true)
    private String razonSocial;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "telefono_alternativo", nullable = false)
    private String telefonoAlternativo;

    @Column(name = "gestor", nullable = false)
    private String gestor;

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cedis> cedis;

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehiculo> vehiculos;

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notas> notas;

    @JsonIgnore
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Costo> costos;

}
