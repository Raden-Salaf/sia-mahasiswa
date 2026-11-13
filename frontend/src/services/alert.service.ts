import Swal from "sweetalert2";

const alertConfig = {
  confirmButtonColor: "#B91C1C",
  cancelButtonColor: "#64748B",
  buttonsStyling: true,
};

export const alertService = {
  success(title: string, text: string) {
    return Swal.fire({
      ...alertConfig,
      icon: "success",
      title,
      text,
      confirmButtonText: "Mengerti",
    });
  },

  error(title: string, text: string) {
    return Swal.fire({
      ...alertConfig,
      icon: "error",
      title,
      text,
      confirmButtonText: "Tutup",
    });
  },

  info(title: string, text: string) {
    return Swal.fire({
      ...alertConfig,
      icon: "info",
      title,
      text,
      confirmButtonText: "Mengerti",
    });
  },

  confirm(title: string, text: string) {
    return Swal.fire({
      ...alertConfig,
      icon: "warning",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Ya, lanjutkan",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });
  },

  loading(title: string) {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close() {
    Swal.close();
  },
};
