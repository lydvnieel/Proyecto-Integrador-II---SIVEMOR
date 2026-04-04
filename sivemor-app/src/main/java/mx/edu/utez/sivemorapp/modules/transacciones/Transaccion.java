package mx.edu.utez.sivemorapp.modules.transacciones;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.TipoPago;
import mx.edu.utez.sivemorapp.modules.notas.Notas;
import mx.edu.utez.sivemorapp.modules.usuarios.Usuario;
import jakarta.persistence.PrePersist;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Transaccion extends AuditFields {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaccion")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nota", nullable = false)
    private Notas nota;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pago", nullable = false)
    private TipoPago tipoPago;

    @Column(name = "monto", nullable = false)
    private BigDecimal monto;

    @Column(name = "cuenta_deposito")
    private String cuentaDeposito;

    @Column(name = "numero_factura", nullable = false)
    private String numeroFactura;

    @Column(name = "pagado", nullable = false)
    private Boolean pagado;

    @Column(name = "fecha_pedido", nullable = false)
    private LocalDateTime fechaPedido;

    @Column(name = "cotizacion", nullable = false)
    private String cotizacion;

    @ManyToOne
    @JoinColumn(name = "reviso")
    private Usuario reviso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "atendio", nullable = false)
    private Usuario atendio;

    @Column(name = "pendiente", nullable = false)
    private Boolean pendiente;

    @Column(name = "comentario")
    private String comentario;
}
