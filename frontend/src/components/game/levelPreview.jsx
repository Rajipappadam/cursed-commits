export default function LevelPreview({ levelData }) {
  if (!levelData) return null;

  const { grid, monsters, powerUps, metadata, difficulty } = levelData;

  const difficultyColors = {
    easy: "#10B981",
    medium: "#F59E0B",
    hard: "#EF4444",
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f8f8",
        borderRadius: "12px",
        padding: "2rem",
        marginTop: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ color: "#333", margin: 0 }}>Generated Level Preview</h3>
        <div
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: difficultyColors[difficulty],
            color: "white",
            borderRadius: "6px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {difficulty}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatBox
          icon="📐"
          label="Grid Size"
          value={`${grid.width}×${grid.height}`}
        />
        <StatBox
          icon="✅"
          label="Safe Cells"
          value={`${metadata.safeCells} (${metadata.safePercentage}%)`}
        />
        <StatBox icon="⚠️" label="Danger Cells" value={metadata.dangerCells} />
        <StatBox icon="👾" label="Monsters" value={metadata.monsterCount} />
        <StatBox icon="⚡" label="Power-ups" value={metadata.powerUpCount} />
        <StatBox
          icon="⏱️"
          label="Est. Time"
          value={`${Math.floor(metadata.estimatedDuration / 60)}m`}
        />
        <StatBox
          icon="🎯"
          label="Difficulty"
          value={`${metadata.difficultyScore}/10`}
        />
      </div>

      {/* Mini Grid Preview */}
      <div>
        <h4 style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>
          Level Preview (Zoomed Out)
        </h4>
        <div
          style={{
            overflowX: "auto",
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${grid.width}, 8px)`,
              gap: "2px",
              width: "fit-content",
            }}
          >
            {grid.cells.map((cell) => {
              let color = "#eee";

              // Check if cell has monster
              const hasMonster = monsters.some(
                (m) => m.x === cell.x && m.y === cell.y
              );
              // Check if cell has powerup
              const hasPowerUp = powerUps.some(
                (p) => p.x === cell.x && p.y === cell.y
              );

              if (hasMonster) {
                color = "#ef4444"; // Red for monsters
              } else if (hasPowerUp) {
                color = "#f59e0b"; // Orange for powerups
              } else if (cell.safe) {
                color = "#10b981"; // Green for safe
              } else {
                color = "#1f2937"; // Dark for danger
              }

              return (
                <div
                  key={cell.id}
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: color,
                    borderRadius: "1px",
                  }}
                  title={`${cell.date}: ${cell.commits} commits`}
                />
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "1rem",
            fontSize: "0.8rem",
            color: "#666",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#10b981",
                borderRadius: "2px",
              }}
            />
            Safe
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#1f2937",
                borderRadius: "2px",
              }}
            />
            Danger
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#ef4444",
                borderRadius: "2px",
              }}
            />
            Monster
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#f59e0b",
                borderRadius: "2px",
              }}
            />
            Power-up
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#fff",
        borderRadius: "8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{icon}</div>
      <div
        style={{ fontSize: "0.75rem", color: "#999", marginBottom: "0.25rem" }}
      >
        {label}
      </div>
      <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}>
        {value}
      </div>
    </div>
  );
}
