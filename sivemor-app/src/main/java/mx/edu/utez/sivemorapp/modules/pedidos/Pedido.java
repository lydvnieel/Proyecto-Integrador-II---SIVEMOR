package mx.edu.utez.sivemorapp.modules.pedidos;

import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.kernel.AuditFields;
import mx.edu.utez.sivemorapp.kernel.enums.EstatusEnvio;
import mx.edu.utez.sivemorapp.modules.notas.Notas;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido extends AuditFields {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nota", nullable = false)
    private Notas nota;

    @Column(name = "numero_guia")
    private String numeroGuia;

    @Column(name = "recibio")
    private String recibio;

    @Lob
    @Column(name = "foto")
    private Byte[] foto;

    @Column(name = "foto_mime_type")
    private String foto_mime_type;

    @Column(name = "foto_tamano_bytes")
    private Integer foto_tamano_bytes;

    @Enumerated(EnumType.STRING)
    @Column(name  = "estatus_envio")
    private EstatusEnvio estatus_envio;

    @Column(name = "comentario")
    private String comentario;
}
