#!/usr/bin/env bash
set -euo pipefail
umask 077

local_host="${1:-}"
if [[ -z "$local_host" ]]; then
  echo "Pemakaian: npm run cert:local -- <IP-LAN-komputer>"
  exit 1
fi

cert_dir="$(cd "$(dirname "$0")/.." && pwd)/certs"
mkdir -p "$cert_dir"
chmod 700 "$cert_dir"

ca_key="$cert_dir/sisko-local-ca-key.pem"
ca_cert="$cert_dir/sisko-local-ca.crt"
server_key="$cert_dir/sisko-local-key.pem"
server_csr="$cert_dir/sisko-local.csr"
server_cert="$cert_dir/sisko-local-cert.pem"
extensions="$cert_dir/sisko-local-extensions.cnf"

if [[ ! -f "$ca_key" || ! -f "$ca_cert" ]]; then
  openssl genrsa -out "$ca_key" 3072
  openssl req -x509 -new -sha256 -days 3650 -key "$ca_key" -out "$ca_cert" -subj "/CN=SISKO Local Development CA"
  chmod 600 "$ca_key"
fi

openssl req -new -newkey rsa:2048 -nodes -keyout "$server_key" -out "$server_csr" -subj "/CN=$local_host"
chmod 600 "$server_key"

if [[ "$local_host" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  host_san="IP.2 = $local_host"
else
  host_san="DNS.2 = $local_host"
fi

cat > "$extensions" <<EOF
[server_ext]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
$host_san
EOF

openssl x509 -req -sha256 -days 825 -in "$server_csr" -CA "$ca_cert" -CAkey "$ca_key" -CAcreateserial -out "$server_cert" -extfile "$extensions" -extensions server_ext
rm -f "$server_csr" "$extensions"

echo "HTTPS lokal siap untuk https://$local_host:3000"
echo "Pasang CA publik ini di ponsel: $ca_cert"
echo "Jangan bagikan file private key di $cert_dir."
