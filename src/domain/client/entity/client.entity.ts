export interface ClientProps {
  email: string;
  id: string;
  name: string;
  phone: string;
}

export class Client {
  private constructor(private props: ClientProps) {}

  public static create(name: string, email: string, phone: string) {
    return new Client({
      id: crypto.randomUUID().toString(),
      name,
      phone,
      email,
    });
  }

  public static with(props: ClientProps) {
    return new Client(props);
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get email() {
    return this.props.email;
  }

  public get phone() {
    return this.props.phone;
  }
}
