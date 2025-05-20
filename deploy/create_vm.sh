multipass launch --name my-vm --cpus 2 --memory 2G --disk 10G 22.04
multipass transfer ~/.ssh/id_ed25519.pub my-vm:.ssh/authorized_keys
multipass info my-vm