export function validateShare(value) {
  if (!["private", "org"].includes(value)) throw new Error("share must be private or org.");
  return value;
}

export async function setArtifactSharing(request, id, share) {
  validateShare(share);
  const path = `/api/frame/perm/${id}`;
  const current = await request("GET", path);
  const targetMode = share === "private" ? "owner" : "org";
  if (current?.read?.mode === targetMode || (targetMode === "owner" && current?.read?.mode === "")) return targetMode;
  if (!current?.version || !["", "owner", "users", "org", "public"].includes(current?.read?.mode)) {
    throw new Error("Unrecognized artifact sharing response; audience was not changed.");
  }
  if (current.readModeFrozen || (current.assignableReadModes && !current.assignableReadModes.includes(targetMode))) {
    throw new Error(`This account or organization does not allow ${share} sharing for this artifact.`);
  }
  await request("PATCH", path, {
    read: { mode: targetMode, users: targetMode === "org" ? current.read.users ?? [] : [] },
  }, { "If-Match": current.version });
  const updated = await request("GET", path);
  if (updated?.read?.mode !== targetMode && !(targetMode === "owner" && updated?.read?.mode === "")) {
    throw new Error("The requested sharing mode could not be confirmed. Check the artifact's Share menu.");
  }
  return targetMode;
}
