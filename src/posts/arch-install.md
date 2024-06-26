---
title: Condensed Arch Linux Installation Guide
date: December 06, 2019
---

Considering how often I seem to re-install Arch Linux on various machines and
that I can never seem to remember the exact details, I figured I should write
up a short installation guide, mainly as future reference for myself.
Here we go.

> This post was updated on May 4, 2024.

[[toc]]

## First Steps

Grab an ISO of Arch Linux from [here](https://www.archlinux.org/download/) and
`dd` it onto a USB drive.
Boot into the live image and change the keymap to maintain sanity during the
next steps:

```shell
# loadkeys de-latin1-nodeadkeys
```

Make sure the directory `/sys/firmware/efi/efivars` exists and is not empty,
verifying that we booted in EFI mode.
Next, hook up an ethernet cable and request an IP address

```shell
# dhcpcd
# ping www.google.de
```

Finally, update the system clock via

```shell
# timedatectl set-ntp true
```

## Formatting the Disks and Setting up Disk Encryption

Create a UEFI boot partition:

```shell
# parted -s --align=optimal /dev/sdX mkpart ESP fat32 1MiB 512MiB
# parted -s --align=optimal /dev/sdX set 1 boot set
# mkfs.fat -F32 /dev/sdX1
```

Next, create another partition in which we will create our LVM volume group:

```shell
# parted -s --align=optimal /dev/sdX mkpart primary ext4 513MiB 100%
# pvcreate /dev/sdX2
# vgcreate main /dev/sdX2
# lvcreate -l 100%FREE -n root main
```

In case we want to extend the volume group by another block device, run

```shell
# vgextend main /dev/sdY
```

Next up: disk encryption.
Run

```shell
# cryptsetup luksFormat -c aes-xts-plain64 -s 512 /dev/mapper/main-root
# cryptsetup open /dev/mapper/main-root root
# mkfs.ext4 /dev/mapper/root
# mount /dev/mapper/root /mnt
```

to encrypt, open, format and mount the root partition.
We'll also create a mount point for the boot partition and mount it
accordingly:

```shell
# mkdir /mnt/boot
# mount /dev/sdX1 /mnt/boot
```

Before creating an fstab file, we first create and enable the swapfile so
`genfstab` will pick it up when generating `/etc/fstab` in the next step:

```shell
# fallocate -l 1G /mnt/swapfile
# mkswap /mnt/swapfile
# swapon /mnt/swapfile
```

## Bootstrapping the System

Install the base packages, create the fstab file and chroot into the root
filesystem:

```shell
# pacstrap /mnt base intel-ucode
# genfstab -U /mnt >> /mnt/etc/fstab
# arch-chroot /mnt
```

Now set the timezone and update the hardware clock:

```shell
# ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime
# hwclock --systohc
```

Set the locale:

```shell
# echo "en_US.UTF-8 UTF-8" >/etc/locale.gen
# locale-gen
# echo "LANG=en_US.UTF-8" >/etc/locale.conf
# echo "KEYMAP=de-latin1-nodeadkeys" >/etc/vconsole.conf
```

Set the hostname and append an entry to the hosts file:

```shell
# HNAME=bla
# echo $HNAME >/etc/hostname
# echo "127.0.0.1\t${HNAME}.localdomain\t${HNAME} >>/etc/hosts"
```

## Bootloader

Before creating the initramfs and installing the bootloader, we'll have to make
sure to enable LVM and encryption support in the `mkinitcpio` config.
To that end, change the **HOOKS** line in `/etc/mkinitcpio.conf` to

```raw
HOOKS=(... keyboard keymap block lvm2 encrypt filesystems ...)
```

Then run

```shell
# mkinitcpio -p linux
```

to create the initramfs.
Now install the bootloader and configure the loader to decrypt the root
partition at boot:

```shell
# bootctl --path=/boot install
# UUID=$(blkid -s UUID -o value /dev/mapper/main-root)
# cd /boot/loader/entries
# cat <<'EOF' > arch.conf
title Arch Linux
linux /vmlinuz-linux
initrd /intel-ucode.img
initrd /initramfs-linux.img
options cryptdevice=UUID=${UUID}:root root=/dev/mapper/root quiet rw
EOF
```

Let's also set a root password before finally rebooting the system:

```shell
# passwd
# exit
# reboot
```

## Graphical User Interface

Let's install the X server, a display manager, a terminal emulator and our
window manager:

```shell
# pacman -S sudo xorg-server xf86-video-intel lightdm
# pacman -S xmonad xmonad-contrib polybar kitty neovim
```

Create a user, create a system group _autologin_ and add the user:

```shell
# useradd -m nik
# passwd nik
# groupadd -r autologin
# gpasswd -a nik autologin
```

While we're at it, let's also give the user `sudo` privileges by adding

```raw
nik ALL=(ALL) NOPASSWD: ALL
```

to the sudoers file via `EDITOR=nvim visudo`.

Add the lines

```raw
autologin-user=nik
autologin-session=xmonad
```

to the `[Seat:*]` section in `/etc/lightdm/lightdm.conf`, and enable/start the
service:

```shell
# systemctl enable --now lightdm
```

Let's also go ahead and set the keyboard layout for the X server:

```shell
# mkdir -p /etc/X11/xorg.conf.d
# cat <<'EOF' > /etc/X11/xorg.conf.d/20-keyboard.conf
Section "InputClass"
  Identifier "keyboard"
  MatchIsKeyboard "yes"
  Option "XkbLayout" "de"
  Option "XkbVariant" "nodeadkeys"
EndSection
EOF
```

## Arch User Repository (AUR)

In order to interface with the AUR, we opt for `paru`.
To install it, we first need to grab the package from the AUR itself.
To that end, we first install a few needed base packages:

```shell
# pacman -S git make fakeroot pkg-config
```

Now grab `paru` from the AUR git, and build and install the package:

```shell
# git clone https://aur.archlinux.org/paru.git /tmp/paru && makepkg -siD /tmp/paru
```

With `paru` set up, let's install a convenient pacman hook to update the
bootloader after kernel upgrades.

```shell
# paru -S systemd-boot-pacman-hook
```
