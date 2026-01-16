import crypto from "crypto";

const NAMESPACE = "cairus.carlogonzales.com";

function uuidFromName(name) {
  const hash = crypto
    .createHash("sha1")
    .update(`${NAMESPACE}:${name.toLowerCase().trim()}`)
    .digest("hex");

  // Format as UUID v5
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    "5" + hash.substring(13, 16), // version 5
    ((parseInt(hash.substring(16, 17), 16) & 0x3) | 0x8).toString(16) +
    hash.substring(17, 20), // variant
    hash.substring(20, 32),
  ].join("-");
}

/**
 * Generate invitation JSON
 */
function generateInvitations(names = []) {
  return {
    invitations: names.map((name) => ({
      name,
      code: uuidFromName(name),
    })),
  };
}

// ------------------------
// EXAMPLE USAGE
// ------------------------

const names = [
  "Juan Dela Cruz",
  "Maria Santos",
  "Pedro Reyes",
  "Carlo Gonzales",
];

const result = generateInvitations(names);

// Output JSON
console.log(JSON.stringify(result, null, 2));
