package mx.edu.utez.sivemorapp.modules.cedis;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import mx.edu.utez.sivemorapp.modules.clientes.Cliente;
import mx.edu.utez.sivemorapp.modules.vehiculos.Vehiculo;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cedis")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cedis{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cedis")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cedis", nullable = false)
    private Cliente cliente;

    @Column(name = "id_region", nullable = false)
    private Long idRegion;

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
    private String telefono_alternativo;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @JsonIgnore
    @OneToMany(mappedBy = "cedis", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Vehiculo> vehiculos;

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
