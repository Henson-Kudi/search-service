// Manage your use cases in this folder
export default interface IUseCase<Input extends unknown[], Output = unknown> {
  execute(...params: Input): Promise<Output>;
}
