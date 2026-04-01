package mx.edu.utez.sivemorapp.modules.vehiculos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.cedis.Cedis;
import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import jakarta.persistence.Entity;
import java.util.List;

@Entity
@Table(name = "vehiculos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehiculo extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vehiculo")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cedis", nullable = false)
    private Cedis cedis;

    @Column(name = "placa", nullable = false)
    private String placa;

    @Column(name = "serie", nullable = false)
    private String serie;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @JsonIgnore
    @OneToMany(mappedBy = "vehiculo", fetch = FetchType.LAZY)
    private List<Verificacion> verificaciones;

}
