package mx.edu.utez.sivemorapp.modules.cedis;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.regiones.Region;
import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cedis")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Cedis extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cedis")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_region", nullable = false)
    private Region region;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "direccion", nullable = false)
    private String direccion;

    @Column(name = "encargado", nullable = false)
    private String encargado;

    @Column(name = "correo", nullable = false)
    private String correo;

    @Column(name = "telefono", nullable = false)
    private String telefono;

    @Column(name = "telefono_alternativo", nullable = false)
    private String telefonoAlternativo;

    @JsonIgnore
    @OneToMany(mappedBy = "cedis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vehiculo> vehiculos;

}
