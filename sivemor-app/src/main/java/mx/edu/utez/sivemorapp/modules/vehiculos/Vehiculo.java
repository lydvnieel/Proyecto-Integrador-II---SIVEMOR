package mx.edu.utez.sivemorapp.modules.vehiculos;

import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.cedis.Cedis;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehiculo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehiculo{

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

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.activo == null) this.activo = true;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


}
