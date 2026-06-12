export function matchAffordableProjects(projects, identity, workArea) {
  if (!identity || !workArea) return [];

  return projects.filter((project) => {
    if (project.area !== workArea) return false;
    if (identity === "newworker") return project.type.includes("蓝领公寓");
    if (identity === "graduate" || identity === "talent") return project.type.includes("人才");
    return true;
  });
}
