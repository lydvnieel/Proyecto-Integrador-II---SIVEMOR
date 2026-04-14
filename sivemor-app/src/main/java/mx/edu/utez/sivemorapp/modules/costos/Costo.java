package mx.edu.utez.sivemorapp.modules.costos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.Materia;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "costos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Costo extends AuditFields {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_costo")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(name = "materia", nullable = false)
    private Materia materia;

    @Column(name = "costo", nullable = false)
    private BigDecimal costo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encargado", nullable = false)
    private Usuario encargado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atiende_y_cobra", nullable = false)
    private Usuario atiendeYCobra;




}
