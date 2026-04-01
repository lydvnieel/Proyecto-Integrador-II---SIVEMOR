package mx.edu.utez.sivemorapp.modules.notas;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.pedidos.Pedido;
import mx.edu.utez.sivemorapp.modules.transacciones.Transaccion;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import mx.edu.utez.sivemorapp.modules.verificaciones.Verificacion;
import mx.edu.utez.sivemorapp.modules.verificentros.Verificentro;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "notas")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notas extends AuditFields {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nota")
    private Long id;

    @Column(name = "folio_nota", nullable = false, unique = true)
    private String folio_nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_verificentro", nullable = false)
    private Verificentro verificentro;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pago", nullable = false)
    private TipoPago tipoPago;

    @Column(name = "anticipo", nullable = false)
    private BigDecimal anticipo;

    @Column(name = "pagado_completo", nullable = false)
    private Boolean pagadoCompleto = false;

    @Column(name = "atendio", nullable = false)
    private Integer atendio;

    @ManyToOne
    @JoinColumn(name = "reviso")
    private Usuario reviso;

    @Column(name = "comentario", nullable = false)
    private String comentario;

    @Column(name = "numero_verificaciones", nullable = false)
    private Integer numero_verificaciones = 0;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fecha_creacion;

    @JsonIgnore
    @OneToMany(mappedBy = "nota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Verificacion> verificaciones;

    @JsonIgnore
    @OneToMany(mappedBy = "nota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaccion> transacciones;

    @JsonIgnore
    @OneToMany(mappedBy = "nota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pedido> pedidos;
}
